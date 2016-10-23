/**
 * Created by G on 23-10-2016.
 */

// var socket = io();

$(function () {
   console.log('Control loaded');

   $('#update_status_btn_id').on('click', function (e) {
      $.getJSON('api', updateStatus);
   });

   $('#update_item_5_value_btn_id').on('click', function (e) {
      var item_id = this.id.split('_')[2];
      var item_value = $('#item_input_field_id').val();

      if (item_value) {
         $.getJSON('api/' + item_id + '/' + item_value, updateItemValue);
      } else {
         alert('The new value can\'t be empty!!');
      }
   });
   $.getJSON('api', updateStatus);

   // socket.on('connect', function () {
   //    console.log('connected');
   // });
});

function updateStatus(data) {
   console.log(data);
   $('#type_status_field_id').text(data.type);
   $('#data_status_field_id').text(data.data);
   $('#updated_status_field_id').text(data.time);
}

function updateItemValue(data) {
   console.log(data);
   $('#item_5_current_value_field_id').text(data.value);
   $('#item_5_updated_field_id').text(data.time);
}