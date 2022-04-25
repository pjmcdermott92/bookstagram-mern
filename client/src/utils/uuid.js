export default function uuid() {
    return 'x-xyx'.replace(/[xy]/g, () => {
        const rand = Math.floor(Math.random() * new Date());
        return rand.toString(16);
    });
}