// ==UserScript==
// @name				ai-challenge Exporter
// @id					ai-challenge_exporter
// @namespace			ai-challenge_exporter
// @version				0.1
// @author				KOLANICH
// @copyright			KOLANICH, 2014
// @description			Helps you export all the files from ai-challenge.com into zip archive
// @license				GNU GPL v3
// @noframes			1
// @website				https://github.com/KOLANICH/ai-challenge-Exporter
// @include				http://ai-challenge.com/ru/profile/*
// @resource			jszip	https://raw.github.com/Stuk/jszip/master/jszip.js
// @run-at				document-end
// @contributionURL		https://github.com/KOLANICH/ai-challenge-Exporter/fork
// @contributionAmount	feel free to fork and contribute
// ==/UserScript==
//var unpackCodesRx=/([a-f\d]{32})(\w+\.\w+)\1/ig;
const unpackCodesRx=/89c4e347cdca08508a415e959f2a9b5c(\w+\.\w+)89c4e347cdca08508a415e959f2a9b5c/ig;
function checkInjection(){
	if(typeof JSZip==="undefined")
		eval(GM_getResourceText('jszip').replace("var JSZip","JSZip"));
}
function unpackCodes(str){
	let tokenz=unescape(str).split(unpackCodesRx);
	let filez={};
	let j=0;
	/*for(var i=1;i<tokenz.length;i+=3){
		let hash=tokenz[i];
		let code=tokenz[i+2];
		f(hash!=GM_cryptoHash(code, "MD5").toLowerCase()){
			i-=2;
			continue;
		}
		filez[tokenz[i+1]]={};
		filez[tokenz[i+1]].hash=hash;
		filez[tokenz[i+1]].code=code;
		j++;
	}*/
	for(let i=1;i<tokenz.length;i+=2){
		filez[tokenz[i]]={};
		filez[tokenz[i]].code=tokenz[i+1];
		j++;
	}
	return filez;
}

function exportToZip(filez){
	checkInjection();
	var zip = new JSZip();
	console.log(zip);
	for(let fileName in filez){
		zip.file(fileName, filez[fileName].code);
	}
	var blob=zip.generate({type:"blob",compression:"STORE"});
	console.log(blob);
	return URL.createObjectURL(blob);
}

GM_registerMenuCommand("export",function(){
	let filez=unpackCodes(decodeURIComponent(unsafeWindow["tournamentView"].model.attributes.code));
	GM_openInTab(exportToZip(filez));
});
GM_registerMenuCommand("export from editor",function(){
	alert("NOT IMPLEMENTED!");
	GM_openInTab("https://github.com/KOLANICH/ai-challenge-Exporter/issues/1");
	/*var spl = this.get("splitCode");
	if (!$(btn).hasClass("disabled")) {
		$(btn).addClass("disabled").html("Отправка...");
	for (var name in spl) {
		data += "89c4e347cdca08508a415e959f2a9b5c" + name + "89c4e347cdca08508a415e959f2a9b5c" + encodeURIComponent(spl[name].cm.getValue());
	}
	let codePacked=decodeURIComponent(unsafeWindow["tournamentView"].model.attributes.code);
	console.log(unpackCodes(codePacked));*/
});