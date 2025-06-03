
// This function will be called everytime user added any character in the search feild, think that input feild as controled component in react and for each keystroke, we are calling this function and updating the state of suggesition. (There is 500ms debounce too)
// size is the number of search results to return, default to 5, we can send less if we don't have 5 matching results. 5 is the upper cap
export const searchItems = async (term: string, size: number = 5) => {
    console.log("This is called with: ", term)
};
