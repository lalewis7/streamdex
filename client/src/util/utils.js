export function runtime(mins){
    var h = 0, m = mins;
    if (m > 60){
        h = Math.floor(m/60);
        m = m%60;
    }
    return h+"h "+m+"m";
}