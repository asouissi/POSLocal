import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';

function hasGetUserMedia() {
    return (navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

const FREEZE_MS = 1000 * 2;

export default class Webcam extends Component {
    static defaultProps = {
        audio: true,
        height: 480,
        width: 640,
        screenshotFormat: 'image/webp',
        onUserMedia: () => {
        }
    };

    static propTypes = {
        audio: PropTypes.bool,
        muted: PropTypes.bool,
        onUserMedia: PropTypes.func,
        height: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        width: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        screenshotFormat: PropTypes.oneOf([
            'image/webp',
            'image/png',
            'image/jpeg'
        ]),
        className: PropTypes.string
    };

    constructor() {
        super();
        this.state = {
            hasUserMedia: false
        };
    }

    componentDidMount() {
        if (!hasGetUserMedia()) {
            return;
        }

        if (!this.state.hasUserMedia) {
            this.requestUserMedia();
        }
        if (this.props.initController) {
            this.props.initController(this);
        }

        this._watchDog = setInterval(() => {
            if (!this._timeUpdate) {
                return;
            }
            let now = Date.now();
            //console.error("F? ", now - this._timeUpdate);

            if (now - this._timeUpdate < FREEZE_MS) {
                return;
            }

            console.error("FREEEEEEEEZE !", now - this._timeUpdate);

            this.props.onFreeze && this.props.onFreeze();
        }, 1000);
    }

    /***
     * @Returns {Promise}
     */
    static listVideoDevices() {
        if ('mediaDevices' in navigator) {
            let promise = navigator.mediaDevices.enumerateDevices().then((devices) => {
                let videoDevices = devices.filter((source) => (source.kind === 'video' || source.kind === 'videoinput'));

                return videoDevices;
            });

            return promise;
        }

        if ('MediaStreamTrack' in window) {

            let promise = new Promise((resolve, reject) => {
                try {
                    MediaStreamTrack.getSources((sources) => {
                        let videoSource = sources.find((source) => (source.kind === 'video' || source.kind === 'videoinput'));

                        resolve(videoSource);
                    });
                } catch (x) {
                    reject(x);
                }
            });
            return promise;
        }

        let error = new Error("Not supported");
        error.code = "NOT_SUPPORTED";

        return Promise.reject(error);
    }

    componentWillUpdate(nextProps, nextState) {
        this._timeUpdate = 0;

        if (nextProps.videoSourceId !== this.props.videoSourceId) {
            console.log("*** UPDATE videoSourceId");

            this._userMediaRequested = false;

            this._timeUpdate = 0;
            this.closeStream();
            setTimeout(() => {
                this._timeUpdate = 0;

                this.requestUserMedia();
            }, 1000);
        }
    }

    requestUserMedia() {
        if (this._userMediaRequested) {
            return;
        }
        this._userMediaRequested = true;

        let getUserMedia = hasGetUserMedia();

        let sourceSelected = (audioSource, videoSource) => {
            console.log("Selection: AudioSource=", audioSource, "VideoSource=", videoSource);
            let constraints = {};

            if (videoSource && videoSource.deviceId) {
                constraints.video = {
                    //optional: [{sourceId: videoSource.deviceId}],
                    deviceId: {exact: videoSource.deviceId}
                }
            }

            if (audioSource && audioSource.deviceId) {
                constraints.audio = {
                    //optional: [{sourceId: audioSource.deviceId}],
                    deviceId: {exact: audioSource.deviceId}
                };
            }

            getUserMedia.call(navigator, constraints, (stream) => {
                this.handleUserMedia(null, stream);

            }, (error) => {
                this.handleUserMedia(error);
            });
        };

        if (this.props.audioSource || this.props.videoSource) {
            sourceSelected(this.props.audioSource, this.props.videoSource);
            return;
        }

        if ('mediaDevices' in navigator) {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                devices.forEach((device) => {
                    console.log("Device kind=" + device.kind + " label=" + device.label + " id=" + device.deviceId);
                });

                console.log("VideoSourceId=", this.props.videoSourceId);

                let audioSource;
                if (this.props.audio) {
                    audioSource = devices.find((source) => (source.kind === 'audio' || source.kind === 'audioinput'));
                }
                let videoSource = devices.find((source) => {
                    if (source.kind !== 'video' && source.kind !== 'videoinput') {
                        return false;
                    }

                    if (this.props.videoSourceId && source.deviceId !== this.props.videoSourceId) {
                        return false;
                    }

                    return true;
                });

                sourceSelected(audioSource, videoSource);

            }).catch((error) => {
                console.error("Invocation error=", error);
                this.handleUserMedia(error);
            });
            return;
        }

        if ('MediaStreamTrack' in window) {
            MediaStreamTrack.getSources((sources) => {
                sources.forEach((source) => {
                    console.log("Source kind=" + source.kind + " label=" + source.label + " id=" + source.id);
                });

                let audioSource;
                if (this.props.audio) {
                    audioSource = sources.find((source) => (source.kind === 'audio' || source.kind === 'audioinput'));
                }
                let videoSource = sources.find((source) => {
                    if (source.kind !== 'video' && source.kind !== 'videoinput') {
                        return false;
                    }

                    if (this.props.videoSourceId && source.deviceId !== this.props.videoSourceId) {
                        return false;
                    }

                    return true;
                });

                sourceSelected(audioSource && audioSource.id, videoSource && videoSource.id);
            });
            return;
        }
    }

    handleUserMedia(error, stream) {
        console.log("Handle user media=", stream, "error=", error);
        if (error) {
            this.setState({
                hasUserMedia: false,
                mediaError: error,
                stream: null
            });

            this.props.onUserMedia(error);
            return;
        }

        let src = window.URL.createObjectURL(stream);

        this.setState({
            hasUserMedia: true,
            mediaError: null,
            src: src,
            stream: stream
        });

        this.props.onUserMedia(null, src, stream);
    }

    closeStream() {
        let stream = this.state.stream;
        if (stream) {
            if (stream.stop) {
                stream.stop();
            }

            if (stream.getVideoTracks) {
                try {
                    for (let track of stream.getVideoTracks()) {
                        track.stop();
                    }
                } catch (x) {
                    console.error(x);
                }
            }
            if (stream.getAudioTracks) {
                try {
                    for (let track of stream.getAudioTracks()) {
                        track.stop();
                    }
                } catch (x) {
                    console.error(x);
                }
            }
        }
        if (this.state.src) {
            window.URL.revokeObjectURL(this.state.src);
        }
    }

    componentWillUnmount() {
        if (this._watchDog) {
            clearInterval(this._watchDog);
            delete this._watchDog;
        }

        if (this.props.initController) {
            this.props.initController(null);
        }

        this.closeStream();

        this._userMediaRequested = false;
    }

    getScreenshot() {
        if (!this.state.hasUserMedia) {
            return null;
        }

        let canvas = this.createCanvas();
        return canvas; //.toDataURL(this.props.screenshotFormat);
    }

    handleOnClick(event) {
        // Stop 2 events before 1000ms
        if (this._lastClick) {
            let now = Date.now();
            if (this._lastClick + 1000 < now) {
                return;
            }
            this._lastClick = now;
        }
        this.props.onClick && this.props.onClick(event);
    }

    handleTimeUpdate(event) {
        //console.log("TIME UPDATE", event, Date.now());
        this._timeUpdate = Date.now();
    }

    createCanvas() {
        if (!this.state.hasUserMedia) {
            return null;
        }

        const video = findDOMNode(this);

        let context2d = this._context2d;
        let canvas = this._canvas;
        if (!context2d) {
            canvas = document.createElement('canvas');
            this._canvas = canvas;

            const aspectRatio = video.videoWidth / video.videoHeight;
            canvas.width = video.clientWidth;
            canvas.height = video.clientWidth / aspectRatio;

            context2d = canvas.getContext('2d');
            this._context2d = context2d;
        }

        context2d.drawImage(video, 0, 0, canvas.width, canvas.height);

        return canvas;
    }

    render() {
        return (
            <video
                autoPlay
                onClick={(event) => this.handleOnClick(event)}
                onTimeUpdate={(event) => this.handleTimeUpdate(event)}
                onTouchStart={(event) => this.handleOnClick(event)}
                width={this.props.width}
                height={this.props.height}
                src={this.state.src}
                muted={this.props.muted}
                className={this.props.className}
            />
        );
    }
}