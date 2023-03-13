import { fetchImages, limit } from "./js/fetchImages";
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm";
import Notiflix from 'notiflix';
import "simplelightbox/dist/simple-lightbox.min.css";
import InfiniteAjaxScroll from '@webcreate/infinite-ajax-scroll';
export let page = 1;

const formEl = document.querySelector('#search-form')
const inputEl = document.querySelector('input')
const listEl = document.querySelector('.gallery')
const btnEl = document.querySelector('.load-more')

const onSearchImg = (e) => {
  clearGallery();
  e.preventDefault();
  showImg(fetchImages(inputEl.value));
  showSuccess(fetchImages(inputEl.value));
  page += 1
  btnEl.classList.remove('hidden');
  
}

const onClickLoadMore = (e) => {
  showImg(fetchImages(inputEl.value));
  page += 1;
}

const renderImg = (array) => {
 const gallery = array.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
  return `<div class="gallery__item">
  <a class="next" href=${largeImageURL}><img src= ${webformatURL} alt="${tags}" loading="lazy" width="350" height="200px" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`
})
.join("")

 listEl.insertAdjacentHTML('beforeend', gallery);
 let lightbox = new SimpleLightbox('.gallery a');
 let ias = new InfiniteAjaxScroll('.gallery', {
  item: '.gallery__item',
  next: onClickLoadMore,
  pagination: '.load-more',
});
}

const showImg = async (response) => {
  const array = await response;
  const totalPages = 100 / limit;

  if (array.hits.length > 0) {
    return renderImg(array.hits);
  }

  if (page > totalPages) {
    btnEl.classList.add('hidden');
    return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
  }
  
  if (array.hits.length === 0) {
    btnEl.classList.add('hidden');
    return Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.")
  }
  
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
  });

  lightbox.refresh()

}

const showSuccess = async (response) => {
  const allResult = await response;

  if (allResult.hits.length > 0) {
    Notiflix.Notify.success(`Hooray! We found ${allResult.totalHits} images.`)
  }
}

const clearGallery = () => {
  btnEl.classList.toggle('hidden');
  page = 1;
  listEl.innerHTML = '';
}

btnEl.addEventListener('click', onClickLoadMore);
formEl.addEventListener('submit', onSearchImg);
