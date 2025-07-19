window.addEventListener("resize", updateHam);

const FOLDER_IDS = {
	"chess.html": "v1749849541",
	"landscape.html": "v1749851879",
	"portraits.html": "v1749324706",
	"grad.html": "v1749350482",
	"street.html": "v1749841811",
	"wildlife.html": "v1749852048",
};

function showMenu() {
	var ham = document.getElementsByClassName("ham")[0];
	var menu = document.getElementsByClassName("menu-shade")[0];
	ham.style.visibility = "hidden";
	menu.style.opacity = "1";
	menu.style.pointerEvents = "all";
}

function closeMenu() {
	var ham = document.getElementsByClassName("ham")[0];
	var menu = document.getElementsByClassName("menu-shade")[0];
	menu.style.opacity = "0";
	menu.style.pointerEvents = "none";
	ham.style.visibility = "visible";
}

function updateHam() {
	var ham = document.getElementsByClassName("ham")[0];
	if (window.innerWidth > 1024) {
		ham.style.visibility = "hidden";
	} else if (window.innerWidth <= 1024) {
		ham.style.visibility = "visible";
	}
}

function openImageModal(e) {
	var modal = document.getElementsByClassName("image-modal")[0];
	var image = document.getElementsByClassName("modal-image")[0];
	if (getAspectRatio(e.target) <= getViewportRatio()) {
		image.setAttribute("height", "90%");
	} else if (getAspectRatio(e.target) > getViewportRatio()) {
		image.setAttribute("width", "90%");
	}
	image.setAttribute("src", e.target.alt);
	modal.style.opacity = "1";
	modal.style.pointerEvents = "all";
	document.getElementsByTagName("body")[0].style.overflow = "hidden";
}

function closeImageModal() {
	var modal = document.getElementsByClassName("image-modal")[0];
	var image = document.getElementsByClassName("modal-image")[0];
	modal.style.opacity = "0";
	modal.style.pointerEvents = "none";
	document.getElementsByTagName("body")[0].style.overflow = "visible";
	image.setAttribute("height", "initial");
	image.setAttribute("width", "initial");
	image.setAttribute("src", "");
}

function getAspectRatio(image) {
	return image.width / image.height;
}

function getViewportRatio() {
	return window.innerWidth / window.innerHeight;
}

function getMaxDiff(img_cols) {
	let max_diff = 0;
	for (let i = 0; i < img_cols.length; i++) {
		for (let j = i + 1; j < img_cols.length; j++) {
			let h_i = img_cols[i].offsetHeight;
			let h_j = img_cols[j].offsetHeight;
			let diff = Math.abs(h_i - h_j);
			max_diff = Math.max(max_diff, diff);
		}
	}
	return max_diff;
}

function swap(img_cols, i, j) {
	last_i = img_cols[i].lastChild;
	img_cols[i].removeChild(last_i);
	img_cols[j].appendChild(last_i);
}

function attemptSwaps(img_cols) {
	diff = getMaxDiff(img_cols);
	let swapped = true;
	let k = 0;
	while (swapped) {
		swapped = false;
		for (let i = 0; i < img_cols.length; i++) {
			for (let j = 0; j < img_cols.length; j++) {
				if (i != j) {
					swap(img_cols, i, j);
					let new_diff = getMaxDiff(img_cols);
					if (new_diff >= diff) {
						swap(img_cols, j, i);
					} else {
						diff = new_diff;
						swapped = true;
					}
				}
			}
		}
	}
}

async function displayPhotos(page) {
	let base_url = "https://res.cloudinary.com/dc8bzyknn/image/upload/";
	let consec = 0;

	let img_cols = document.getElementsByClassName("gallery")[0].children;
	img_cols = [...img_cols];
	if (window.innerWidth <= 800) {
		for (let i = 0; i < img_cols.length; i++) {
			img_cols[i].style.width = "49.2%";
		}
		img_cols[img_cols.length - 1].style.display = "none";
		img_cols.splice(img_cols.length - 1, 1);
	}

	let i = 1;
	while (consec < 3) {
		let url = `${base_url}${FOLDER_IDS[page]}/${
			page.split(".")[0]
		}${i}.webp`;

		let div = document.createElement("div");
		div.classList.add("gallery-img");
		div.onclick = openImageModal;

		let handled = false;

		let img = document.createElement("img");
		img.src = url;
		img.alt = url;
		// img.loading = "lazy";

		img.onload = () => {
			handled = true;
			consec = 0;
		};

		img.onerror = () => {
			handled = true;
			consec++;
			img.remove();
			div.remove();
		};

		img.setAttribute("width", "100%");
		div.appendChild(img);
		img_cols[i % img_cols.length].appendChild(div);

		await new Promise((resolve) => {
			const checkInterval = setInterval(() => {
				if (handled) {
					clearInterval(checkInterval);
					resolve();
				}
			}, 50);
		});
		i++;
	}
	attemptSwaps(img_cols);
}

// const minIndexBy = (arr, keyFn) => {
// 	if (arr.length === 0) return -1;

// 	let minIndex = 0;
// 	let minValue = keyFn(arr[0]);

// 	for (let i = 1; i < arr.length; i++) {
// 		const value = keyFn(arr[i]);
// 		if (value < minValue) {
// 			minValue = value;
// 			minIndex = i;
// 		}
// 	}

// 	return minIndex;
// };

// async function displayPhotos(page) {
// 	let base_url = "https://res.cloudinary.com/dc8bzyknn/image/upload/";
// 	let consec = 0;

// 	let img_cols = document.getElementsByClassName("gallery")[0].children;
// 	img_cols = [...img_cols];
// 	if (window.innerWidth <= 800) {
// 		for (let i = 0; i < img_cols.length; i++) {
// 			img_cols[i].style.width = "49.2%";
// 		}
// 		img_cols[img_cols.length - 1].style.display = "none";
// 		img_cols.splice(img_cols.length - 1, 1);
// 	}

// 	let i = 1;
// 	while (consec < 3) {
// 		let url = `${base_url}${FOLDER_IDS[page]}/${
// 			page.split(".")[0]
// 		}${i}.webp`;

// 		let div = document.createElement("div");
// 		div.classList.add("gallery-img");
// 		div.onclick = openImageModal;

// 		let handled = false;

// 		let img = document.createElement("img");
// 		img.src = url;
// 		img.alt = url;

// 		img.onload = () => {
// 			handled = true;
// 			consec = 0;
// 		};

// 		img.onerror = () => {
// 			handled = true;
// 			consec++;
// 			img.remove();
// 			div.remove();
// 		};

// 		img.setAttribute("width", "100%");
// 		div.appendChild(img);
// 		let j = minIndexBy(img_cols, (col) => col.offsetHeight);
// 		img_cols[j].appendChild(div);

// 		await new Promise((resolve) => {
// 			const checkInterval = setInterval(() => {
// 				if (handled) {
// 					clearInterval(checkInterval);
// 					resolve();
// 				}
// 			}, 50);
// 		});

// 		i++;
// 	}
// }

// function getCurrentPhotos(page) {
// 	base_url = "https://res.cloudinary.com/dc8bzyknn/image/upload/";
// 	urls = [];
// 	consec = 0;
// 	while (consec < 3) {
// 		urls.push(
// 			`${base_url}${FOLDER_IDS[page]}/${page.split(".")[0]}${i}.jpg`
// 		);
// 	}
// 	return urls;
// }

var path = window.location.pathname;
var page = path.split("/").pop();
console.log(page);
if (FOLDER_IDS[page] != undefined) {
	displayPhotos(page);
}
if (
	page == "index.html" ||
	page == "index.html#filler" ||
	page == "" ||
	page == "#filler"
) {
	let bar = document.getElementsByClassName("smallfoot")[0];
	let footer = document.getElementsByClassName("toe")[0];
	document.addEventListener("scroll", (event) => {
		var foot_top = footer.getBoundingClientRect().top;
		if (foot_top < window.innerHeight) {
			bar.style.opacity = 0;
		} else {
			bar.style.opacity = 1;
		}
	});
}
