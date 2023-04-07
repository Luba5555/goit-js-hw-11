import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


import { fetchImages } from './fetchImages';

const searchForm = document.querySelector('#search-form');
const inputEl = document.querySelector('input[name="searchQuery"]');
const galleryEl = document.querySelector('.gallery');
const searchBtnEl = document.querySelector('button');
const loadMoreBtnEl = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearch);

let name = '';
let page = 1;
let perPage = 40;
let totalPages;
let endOfListIsReached = false;



let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  animationSpeed: 500,
});

async function onSearch(e) {
  e.preventDefault();
  name = inputEl.value.trim();
  searchBtnEl.disabled = false;
  endOfListIsReached = false;
  
  if (name === '') {
    Notiflix.Notify.failure(`Enter a name to search!`);
    return;
  }
  fetchImages(name, page, perPage)
    .then(name => {
      console.log(name.hits);
      console.log(name.totalHits);
      totalPages = Math.round(name.totalHits / perPage);
      console.log(totalPages);
      console.log(page);
      currentHits = name.hits.length;
      console.log(currentHits);
      
      if (name.hits.length > 0) {
        Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
        renderImage(name);
        gallery.refresh();
        //loadMoreBtnEl.classList.remove('visually-hidden');
        console.log(gallery.refresh);
        if (page < totalPages) {
          searchBtnEl.disabled = true;
          
        } else {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        } 
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        // clear();
      }
    })
    .catch(error => console.log(error.message));
}


function renderImage(name) {
  // clear();
  const markup = name.hits.map(hit => {
    return `<div class="photo-card">
                <a class="gallery-item" href="${hit.largeImageURL}">
                <img
                   class="gallery-image"
                  src="${hit.webformatURL}"
                    alt="${hit.tags}"
                     loading="lazy"
                /></a>
                 <div class="info">
                   <div class="info-box">
                     <p class="info-item">
                     <b>Likes</b>
                    </p>
                    <p class="info-value">${hit.likes.toString()}</p>
                  </div>
                   <div class="info-box">
                     <p class="info-item">
                       <b>Views</b>
                     </p>
                     <p class="info-value">${hit.views.toString()}</p>
                   </div>
                   <div class="info-box">
                     <p class="info-item">
                       <b>Comments</b>
                     </p>
                     <p class="info-value">${hit.comments.toString()}</p>
                   </div>
                   <div class="info-box">
                     <p class="info-item">
                       <b>Downloads</b>
                     </p>
                     <p class="info-value">${hit.downloads.toString()}</p>
                   </div>
                 </div>
               </div>`
  })
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
}
searchForm.addEventListener('submit', onSearch);

function clear() {
  galleryEl.innerHTML = '';
}


window.addEventListener(
  'scroll',
  () => {
      if (
          window.innerHeight + window.pageYOffset >= document.body.offsetHeight &&
          page < totalPages
      ) {
          name = inputEl.value;
          page += 1;

          fetchImages(name, page, perPage).then(name => {
              renderImage(name);
              smothScroll();
              gallery.refresh();
              console.log(page);
          });
      } else if (
          window.innerHeight + window.pageYOffset >= document.body.offsetHeight &&
          page >= totalPages &&
          !endOfListIsReached
      ) {
          endOfListIsReached = true;
          setTimeout(() => {
              Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          }, 2000);
      }
  },
  true
);

function smothScroll() {
  const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
  window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
  });
}