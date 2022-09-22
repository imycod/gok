// solution for an in-class exercise given to my webdev students

let video = document.querySelector("video"),
videoOffset = video.getBoundingClientRect();
video.controls = false;
video.pause();
window.onscroll = function() {
	let scrollAmount = videoOffset.top - window.pageYOffset;
	if (scrollAmount < 300) {
		video.play();
	}
}