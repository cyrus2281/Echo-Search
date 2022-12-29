const echoSearch = async (query, onComplete, onError, onUpdate) => {
  const reg = RegExp(query, "gi");
  const replacement = "🤯";
  const text = `
    It seems impossible to imagine texting without abbreviations today, 
    but how did abbreviations become such a massive part of texting lingo? 
    Well, in the days before smartphones, and even before keyboard phones, 
    texters were working with a Cumbersome limited number of characters—160, 
    to be exact—and before “unlimited” plans became the law of the land, 
    each text cost money to send. Plus, typing just with thumbs isn’t quite 
    the speedy process that typing on a traditional keyboard is. Not to mention, 
    before keyboard phones, you had to press the number corresponding 
    with the letter you wanted—enough times for that letter to appear. 
    Needless to say, typing full words was cumbersome, and it 
    became customary to shorten words and phrases. 
    `;
  const newText = text.replaceAll(reg, replacement);
  // line content that matches the regex
  const s = text.split(reg);
  let totalLine = 0;
  if (s.length > 1) {
    for (let i = 0; i < s.length - 1; i++) {
      // count of the occurrence of "\n" in s[i]
      const count = (s[i].match(/\n/g) || []).length;
      totalLine += count;
      console.log(count, totalLine);
    }
  }
  const ns = s.join(replacement);
  console.log(ns);
  console.log(newText);

  // fake progress
  let progress = 0;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  for (let index = 0; index < 10; index++) {
    // sleep 1 second
    await new Promise((resolve) => setTimeout(resolve, 500));
    onUpdate &&
      (await onUpdate({
        totalFiles: 22,
        progress,
        message: index + " Updating file of 22",
      }));
    progress += 10;
    await new Promise((resolve) => setTimeout(resolve, 500));
    onError &&
      (await onError({
        message: index + "Error updating file of 22",
        isFatal: false,
      }));
  }

  await new Promise((resolve) => setTimeout(resolve, 2500));
  onComplete && onComplete({ message: "Search Completed: 22 files updated" });
};

module.exports = echoSearch;
