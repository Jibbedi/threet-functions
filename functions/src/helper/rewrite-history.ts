export function rewriteHistory(history = [], win: boolean) {
    history.push(win);
    if (history.length > 5) {
        history.shift();
    }
    return history;
}