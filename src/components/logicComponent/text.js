function shortenName(name, maxLength) {
    if (name.length <= maxLength) {
        return name;
    } else {
        return name.substring(0, maxLength) + '...';
    }
}

export default {
    shortenName
}