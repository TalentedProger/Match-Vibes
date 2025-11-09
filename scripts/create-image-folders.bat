@echo off
echo Creating image folder structure for subcategories...

cd public\images\subcategories

REM Food and Drinks
mkdir food-favorite-cuisine
mkdir food-favorite-dish
mkdir food-coffee-tea
mkdir food-desserts
mkdir food-street-food
mkdir food-dream-breakfast
mkdir food-dream-restaurant

REM Entertainment and Culture
mkdir entertainment-favorite-movie
mkdir entertainment-movie-genre
mkdir entertainment-favorite-artist
mkdir entertainment-favorite-song
mkdir entertainment-series
mkdir entertainment-favorite-game
mkdir entertainment-inspiring-movie

REM Animals
mkdir animals-dog-breed
mkdir animals-cats-vs-dogs
mkdir animals-ideal-pet
mkdir animals-wildlife

REM Relationships and Personality
mkdir relationships-main-quality
mkdir relationships-main-fear
mkdir relationships-dream
mkdir relationships-friendship
mkdir relationships-care
mkdir relationships-rest-together

REM Leisure and Travel
mkdir leisure-favorite-place
mkdir leisure-ideal-travel
mkdir leisure-active-relax
mkdir leisure-dream-city
mkdir leisure-ideal-weekend

echo.
echo ✅ Image folder structure created successfully!
echo.
echo Next steps:
echo 1. Add images to each folder following the naming convention: card-1.jpg, card-2.jpg, etc.
echo 2. See Docs/Images_Structure.md for detailed instructions
echo.
pause
