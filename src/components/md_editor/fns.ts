export const handlePaste = (e,ctx) => {
    const { clipboardData = {} } = e;
    const { types = [], items } = clipboardData;
    let item = null;
    for (let i = 0; i < types.length; i++) {
        if (types[i] === "Files") {
            item = items[i];
            break;
        }
    }
    if (item) {
        const file = item.getAsFile();
        if (/image/gi.test(file.type)) {
            ctx.emit("on-upload-image", file);
            e.preventDefault();
        }
    }
};
export  function saveMd(fileData,filename){
    let pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=UTF-8,' + encodeURIComponent(fileData));
    pom.setAttribute('download', filename);
    pom.style.display = 'none';
    if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}
