document.addEventListener('DOMContentLoaded', () => {
	const progress = document.querySelector('#progress-bar');
	const prevBtn = document.querySelector('#step-prev');
	const nextBtn = document.querySelector('#step-next');
	const steps = document.querySelectorAll('.step');

	let activeIndex = 1;
	nextBtn.addEventListener('click', () => {
		if (activeIndex > steps.length) {
			activeIndex = steps.length;
		}
		
		activeIndex++;
		updateStep();
	});

	prevBtn.addEventListener('click', () => {
		if (activeIndex < 1) {
			activeIndex = 1;
		}
		activeIndex--;
		updateStep();
	});

	function updateStep() {
		steps.forEach((step, index) => {
			if (index < activeIndex) {
				step.classList.add('active');
			} else {
				step.classList.remove('active');
			}
		});

		const actives = document.querySelectorAll('.active');

		const progressWidth = ((actives.length-1) / (steps.length - 1)) * 100;
		
		progress.style.width = `${progressWidth}%`;

		if (activeIndex === 1) {
			prevBtn.disabled = true;
		} else if (activeIndex === steps.length) {
			nextBtn.disabled = true;
		} else {
			prevBtn.disabled = false;
			nextBtn.disabled = false;
		}
	}
});
