function loadSound(src) {
    const audio = new Audio();
    Object.assign(audio, {
        preload: true,
        src: src
    });

    return audio;
}

export const SHOTGUN_SOUND = {
    shot: loadSound('assets/shot.ogx')
};