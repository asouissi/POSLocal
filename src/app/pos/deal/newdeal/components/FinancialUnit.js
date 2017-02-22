'use strict'
import Select from '../../../../core/components/lib/Select'

export default class AssetEnergy extends Select {

    componentDidMount() {
        var data = [{code: 'km', label: 'kilometer'}, {code: 'miles', label: 'miles'}];
        this.setState(() => ({
            data: data,
            children: this.renderChildren(this.state.data, data)
        }));
    }

}
