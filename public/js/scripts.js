$(function () {
    tryInitFormFields();
});

function tryInitFormFields(){
    //init data
    var $dateCarriage = $('#dateCarriage');
    setFieldAsDataTimePicker($dateCarriage);
    //init tooltip
    $('[data-toggle="tooltip"]').tooltip();
}

function setFieldAsDataTimePicker(field){
    if(field){
        field.datetimepicker({
            locale: 'ru'
        });
    }
}