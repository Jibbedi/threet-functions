export function calculateStreak(currentStreak = 0, win: boolean) {
    const impact = win ? +1 : -1;

    if (currentStreak >= 0 && !win) {
        return impact;
    } else if (currentStreak < 0 && win) {
        return impact;
    } else {
        return currentStreak + impact;
    }
}