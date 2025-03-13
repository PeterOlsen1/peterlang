# compile and run the given typescript file

tsc
node index.js $@

# remove all javascript files that are made by ts compilation
find . -type f -name "*.js" -delete