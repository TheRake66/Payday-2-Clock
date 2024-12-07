if (location.protocol !== 'https:') {
    const path = location.href.substring(location.protocol.length);
    location.replace(`https:${path}`);
}