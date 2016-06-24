(function iife($) {
  $(function grid() {
    const $grid = $('.grid').masonry({
      itemSelector: '.grid-item',
      percentPosition: true,
      columnWidth: '.grid-sizer',
      stamp: '.grid-stamp',
    }).imagesLoaded( () => {
      // init Masonry after all images have loaded
      $grid.masonry();
    });

    $('.js-expand-card').click(e => {
      e.preventDefault();
      const $currentCard = $(this).closest('.card2');
      const $currentGridItem = $currentCard.closest('.grid-item');

      $currentCard.toggleClass('expanded');
      $currentGridItem.toggleClass('expanded');
      $(this).text($currentCard.hasClass('expanded') ? 'Zwiń <' : 'Rozwiń >');

      $('.card2').not($currentCard).removeClass('expanded');
      $('.grid-item').not($currentGridItem).removeClass('expanded');
      $('.js-expand-card').not(this).text("Rozwiń >");

      // Refresh grid;
      $grid.masonry();
    });

    // Wait for iframe ex. Youtube
    // setTimeout(function() {
    //  // Refresh grid;
    //  $grid.masonry();
    // }, 500)
  });
}(jQuery));
