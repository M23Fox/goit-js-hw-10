
// live_gqqWNaO9Sd4z2Eu4CWFTaTVXMf7oQkWSHb4HvcA1O3O3nu6KcoXz0NwgtB2heIIV

import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

const refs = {
  select: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

let allBreeds = null;

function loader() {
  refs.select.classList.toggle('invisible');
  refs.catInfo.classList.toggle('invisible');
  refs.loader.classList.toggle('invisible');
}
fetchBreeds()
  .then(data => {
    allBreeds = data;
    const markup = data
      .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
      .join('');
    refs.select.insertAdjacentHTML('beforeend', markup);
    new SlimSelect({
      select: '#texas',
    });
  })
  .catch(err => {
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
    refs.error.classList.remove('invisible');
    console.log(err);
  })
  .finally(() => {
    setTimeout(() => {
      loader();
    }, 1000);
  });

loader();

refs.select.addEventListener('change', onChangeSelect);
function onChangeSelect(event) {
  loader();
  refs.error.classList.add('invisible');
  console.log(allBreeds);
  const selectValue = event.target.value;
  const breedInfo = allBreeds.find(breed => breed.id === selectValue);
  console.log(breedInfo);
  fetchCatByBreed(selectValue)
    .then(([breedImg]) => {
      console.log(breedImg);
      const catInfoMarkup = `
        <img src="${breedImg.url}" alt="${breedInfo.name}" width="300"/>
        <h2>${breedInfo.name}</h2>
        <p>${breedInfo.description}</p>
        <p><b>Temperament:</b>${breedInfo.temperament}</p>`;
      refs.catInfo.innerHTML = catInfoMarkup;
    })
    .catch(err => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      refs.error.classList.remove('invisible');
      console.log(err);
    })
    .finally(() => {
      loader();
    });
}