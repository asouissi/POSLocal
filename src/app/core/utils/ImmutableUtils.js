export function iremoveArrayIndex(array, indexToRemove){
    return array.filter((item, index) =>
        index !== indexToRemove
    )
}
