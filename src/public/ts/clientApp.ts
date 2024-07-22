console.log("Hi from CTI-simulator ClientApp");
import {ClientAppViewModel} from "./viewModels/clientAppViewModel";

document.addEventListener("DOMContentLoaded", function(){
    ko.applyBindings(new ClientAppViewModel());
});











