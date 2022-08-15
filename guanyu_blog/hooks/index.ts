// 防抖hook
export function useDebounce():Array<Function> {
    let timer:any = null
    let debounce = (fn:() => void, delay:number=1000):Function => {
        return function(this:any) {
            if(timer) clearTimeout(timer)
            let self = this
            let arg:[] = Array.prototype.slice.call(arguments, 0) as []
            timer = setTimeout(() => {
                fn.apply(self, arg)
                clearTimeout(timer)
            }, delay);
        }
    }
    // 用于需要获取定时器
    function getTimer():any {
        return timer
    } 
    
    return [debounce, getTimer]
}