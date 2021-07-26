// 用于减少scroll的触发
export function debounceTool<T>(fn:Function, time:number) {
    let timer:number|null = null
    return function() {
        if(timer !== null) clearTimeout(timer)
        timer = setTimeout(fn, time);
    }
}