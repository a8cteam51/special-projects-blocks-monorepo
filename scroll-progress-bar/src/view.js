document.addEventListener("DOMContentLoaded", function () {
	const progressBar = document.querySelector(".wp-block-a8csp-scroll-progress-bar progress");

	if (!progressBar) {
		console.warn("Progress bar element not found");
		return;
	}

	function updateProgressBar() {
		const scrollTop = window.scrollY;
		const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
		progressBar.value = scrollTop / scrollHeight;
	}

	window.addEventListener("scroll", updateProgressBar);
	updateProgressBar(); // Initialize on load
});
