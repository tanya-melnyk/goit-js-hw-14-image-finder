'use strict';

// styles
import 'material-design-icons/iconfont/material-icons.css';

// helpers
import apiPhotoService from './services/photos-service';
import openModalBtnClickHandler from './services/modal-service';
import spinner from './services/spinner';
import InfiniteScroll from 'infinite-scroll';

// HTML template
import photoCardTemplate from '../templates/photo-card.hbs';

// DOM elements
const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

// initializing Infinite Scroll plugin
const infScrollInstance = new InfiniteScroll(refs.gallery, {
  path: '{{#}}',
  status: '.page-load-status',
});


// adding event listeners
refs.searchForm.addEventListener('submit', searchFormSubmitHandler);
refs.gallery.addEventListener('click', openModalBtnClickHandler);

function searchFormSubmitHandler(e) {
  e.preventDefault();
  clearListItems();

  const form = e.currentTarget;
  const input = form.elements.query;

  apiPhotoService.resetPage();
  apiPhotoService.searchQuery = input.value;
  fetchPhotos();

  // input.value = '';
}

infScrollInstance.on('load', fetchPhotos);

function fetchPhotos() {
  spinner.show();

  apiPhotoService
    .fetchArticles()
    .then(photos => {
      spinner.hide();
      renderPhotoCards(photos);
    })
    .catch(error => {
      console.warn(error);
    });
}

function renderPhotoCards(photos) {
  const markup = photoCardTemplate(photos);

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearListItems() {
  refs.gallery.innerHTML = '';
}
