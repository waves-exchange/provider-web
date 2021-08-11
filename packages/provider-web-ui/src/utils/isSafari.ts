export function isSafari(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafariUA =
        userAgent.includes('safari') && !userAgent.includes('chrome');
    const iOS =
        navigator.platform != null &&
        /iPad|iPhone|iPod/.test(navigator.platform);

    return iOS || isSafariUA;
}

export function isBrave(): boolean {
    return !!(navigator as any).brave?.isBrave;
}
