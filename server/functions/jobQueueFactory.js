
function JobQueue (pushCallbackArray = [], shiftCallbackArray = [], listenerObj = {}) {

    async function listener () {

        setTimeout(listener.bind(this), 500);
    }

    function push (toBePushed) {
        if (pushCallbackArray.length) {
            for (i = 0; i < pushCallbackArray.length; i++) {
                console.log('Executing callback');
                pushCallbackArray[i]();
            }
        }

        this.queue.push(toBePushed);
    }

    function shift () {

        if (shiftCallbackArray.length) {
            for (i = 0; i < shiftCallbackArray.length - 1; i++) {
                shiftCallbackArray[i]();
            }
        }

        return this.queue.shift();
    }

    return {
        push,
        shift,
        listener,
        queue: []
    }
}

module.exports = JobQueue