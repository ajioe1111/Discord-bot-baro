/**
 * 
 * @param {string} command 
 * @returns {string[]}
 */
export function getArguments(command) {

    const pattern = /("{1}[^"]*"{1}|[^ "]+){1,}/igu;

    let arguements = command.match(pattern);
    return arguements;
}