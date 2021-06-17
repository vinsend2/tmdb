import React, { useState, useEffect } from 'react';
import SearchBox from './search';
import Card from './card';

const App = () => {

  
  const [state, setStat] = useState({

    movieID: 157336

  });   

   // the api request function
    function fetchApi(url) {
     
    fetch(url)
      .then((res) => res.json())
           .then((data) => {        
      // update state with API data
       setStat({
         
        movieID: data.id,
        title: data.title,
        tagline: data.tagline,
        overview: data.overview,
        homepage: data.homepage,
        poster: data.poster_path,
        production: data.production_companies,
        production_countries: data.production_countries,
        genre: data.genres,
        release: data.release_date,
        vote: data.vote_average,
        runtime: data.runtime,
        revenue: data.revenue,
        backdrop: data.backdrop_path

      });
     
    })

    .catch((err) => console.log('Movie not found!'))

  } 
   const fetchMovieID = (movieID) => {    
    let url = `https://api.themoviedb.org/3/movie/${movieID}?&api_key=78e75aa187785a04bf603c7381421850&language=ru`;
    
    fetchApi(url);
    
  };

  useEffect(() => {
    let url = `https://api.themoviedb.org/3/movie/${state.movieID}?&api_key=78e75aa187785a04bf603c7381421850&language=ru`;
    fetchApi(url);

    //========================= BLOODHOUND ==============================//
    let suggests = new Bloodhound({
      datumTokenizer: function(datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: 'https://api.themoviedb.org/3/search/movie?query=%QUERY&api_key=78e75aa187785a04bf603c7381421850&language=ru',
        filter: function(movies) {
          // Map the remote source JSON array to a JavaScript object array
          return $.map(movies.results, function(movie) {
            return {
              value: movie.title, // search original title
              id: movie.id // get ID of movie simultaniously
            };
          });
        } // end filter
      } // end remote
    }); // end new Bloodhound

    suggests.initialize(); // initialise bloodhound suggestion engine

    //========================= END BLOODHOUND ==============================//

    //========================= TYPEAHEAD ==============================//
    // Instantiate the Typeahead UI
    $('.typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 2
    }, {source: suggests.ttAdapter()}).on('typeahead:selected', function(obj, datum) {
      fetchMovieID(datum.id);
      console.log(datum.id);
    }); // END Instantiate the Typeahead UI
    //========================= END TYPEAHEAD ==============================//

  },[]);


  return (
    <div>
      <SearchBox fetchMovieID={ useEffect(() => {
    fetchMovieID(state.movieID);
  }, [])}/>
      <Card data={state}/>
    </div>
  );

  
}

export default App;
