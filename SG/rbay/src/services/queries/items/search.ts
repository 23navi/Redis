
// This function will be called everytime user added any character in the search feild, think that input feild as controled component in react and for each keystroke, we are calling this function and updating the state of suggesition. (There is 500ms debounce too)
// size is the number of search results to return, default to 5, we can send less if we don't have 5 matching results. 5 is the upper cap
export const searchItems = async (term: string, size: number = 5) => {
    console.log("This is called with: ", term)

    // Say we get the input from client as "nabi  sure ", now we have to make this input as a form that redisearch expects, we want something like (%nabi% %sure%) {and operation}
    const cleanedInputTerm = term
        .replaceAll(/[^a-zA-Z0-9 ]/g, '') // Remove everything (special characters like %^&, anything other then A-Z, a-z, 0-9 , " ")
        .trim() // Remove trailing spaces
        .split(" ") // Split the string into an array of words
        .filter((word) => word !== "") // Remove empty strings ["nabi", " ", "sure"] -> ["nabi", "sure"] and add 
        .map((word) => word ? `%${word}%` : "") // Add %% around words
        .join(" "); // finally convert string[] to string


};
