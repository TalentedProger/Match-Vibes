# Create image folder structure for subcategories
Write-Host "Creating image folder structure..." -ForegroundColor Green

$folders = @(
    # Food and Drinks
    "public\images\subcategories\food-favorite-cuisine",
    "public\images\subcategories\food-favorite-dish",
    "public\images\subcategories\food-coffee-tea",
    "public\images\subcategories\food-desserts",
    "public\images\subcategories\food-street-food",
    "public\images\subcategories\food-dream-breakfast",
    "public\images\subcategories\food-dream-restaurant",
    
    # Entertainment and Culture
    "public\images\subcategories\entertainment-favorite-movie",
    "public\images\subcategories\entertainment-movie-genre",
    "public\images\subcategories\entertainment-favorite-artist",
    "public\images\subcategories\entertainment-favorite-song",
    "public\images\subcategories\entertainment-series",
    "public\images\subcategories\entertainment-favorite-game",
    "public\images\subcategories\entertainment-inspiring-movie",
    
    # Animals
    "public\images\subcategories\animals-dog-breed",
    "public\images\subcategories\animals-cats-vs-dogs",
    "public\images\subcategories\animals-ideal-pet",
    "public\images\subcategories\animals-wildlife",
    
    # Relationships and Personality
    "public\images\subcategories\relationships-main-quality",
    "public\images\subcategories\relationships-main-fear",
    "public\images\subcategories\relationships-dream",
    "public\images\subcategories\relationships-friendship",
    "public\images\subcategories\relationships-care",
    "public\images\subcategories\relationships-rest-together",
    
    # Leisure and Travel
    "public\images\subcategories\leisure-favorite-place",
    "public\images\subcategories\leisure-ideal-travel",
    "public\images\subcategories\leisure-active-relax",
    "public\images\subcategories\leisure-dream-city",
    "public\images\subcategories\leisure-ideal-weekend"
)

$created = 0
$existed = 0

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        $created++
        Write-Host "[+] Created: $folder" -ForegroundColor Cyan
    } else {
        $existed++
        Write-Host "[*] Exists: $folder" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "[OK] Done!" -ForegroundColor Green
Write-Host "Created: $created folders" -ForegroundColor Cyan
Write-Host "Existed: $existed folders" -ForegroundColor Gray
Write-Host ""
Write-Host "Total: $($folders.Count) folders ready" -ForegroundColor Green
