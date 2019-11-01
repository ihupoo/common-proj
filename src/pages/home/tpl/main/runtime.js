import runtime from 'art-template/lib/runtime';

runtime.just = function(parse){
    if(Array.isArray(parse)){
        return 'true'
    }
    return 'false';
}

export default runtime
