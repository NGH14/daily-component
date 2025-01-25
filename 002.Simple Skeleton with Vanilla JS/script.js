const header = document.getElementById('header');
const title = document.getElementById('title');
const excerpt = document.getElementById('excerpt');
const profile_img = document.getElementById('profile_img');
const name = document.getElementById('name');
const date = document.getElementById('date');

const animated_bgs = document.querySelectorAll('.animated-bg');
const animated_bg_texts = document.querySelectorAll('.animated-bg-text');

setTimeout(getData, 2500);

function getData() {
	header.innerHTML =
		'<img src="https://images.unsplash.com/photo-1633113087654-c49c686c2cdf?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60" alt="" />';
	title.innerHTML = 'Random Image';
	excerpt.innerHTML = 'Sai Gon, Viet Nam';
	profile_img.innerHTML =
		'<img src="https://images.unsplash.com/photo-1634913939310-e8b9289f3370?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60" alt="" />';
	name.innerHTML = 'Nghia Huu';
	date.innerHTML = 'Jan 2, 2025';

	animated_bgs.forEach((bg) => bg.classList.remove('animated-bg'));
	animated_bg_texts.forEach((bg) => bg.classList.remove('animated-bg-text'));
}
