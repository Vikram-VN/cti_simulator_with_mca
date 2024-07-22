import {CtiAdminViewModel} from "./viewModels/ctiAdminViewModel";

document.addEventListener("DOMContentLoaded", function(){
    ko.applyBindings(new CtiAdminViewModel());
});
