export function runtime(mins){
    var h = 0, m = mins;
    if (m > 60){
        h = Math.floor(m/60);
        m = m%60;
    }
    return h+"h "+m+"m";
}

export function getMonthText(val){
    switch (val){
        case 0:
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        case 11:
            return "December";
        default:
            return "Unknown";
    }
}