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
