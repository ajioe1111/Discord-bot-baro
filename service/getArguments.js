export function getArguments(command) {

    const pattern = /("{1}[^"]*"{1}|-{1,2}[\wа-яА-Я]+|[\wа-яА-Я]+)/igu;

    let arguements = command.match(pattern);
    return arguements;
}