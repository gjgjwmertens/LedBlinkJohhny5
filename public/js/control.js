/**
 * Created by G on 23-10-2016.
 */

var ws = new WebSocket('ws://20.0.0.112:3030');

ws.onopen = function() {
   $('#websocket_conn_status_field_id').text('Connected');
   $('#websocket_conn_status_field_id').css('color', 'green');
   $('#websocket_status_led_id').css('background-color', 'greenyellow');
};

ws.onclose = function() {
   $('#websocket_conn_status_field_id').text('Disconnected');
   $('#websocket_conn_status_field_id').css('color', 'red');
   $('#websocket_status_led_id').css('background-color', 'red');
};

ws.onmessage = function(payload) {
   var data = '';
   try {
      data = JSON.parse(payload.data);
   } catch (e) {
      data = payload.data;
   }
   // console.log(typeof data);
   if (typeof data === 'object') {
      updateStatus(data);
      updateGraph(data);
   } else {
      console.log(data);
   }
};

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

   $('#ws_close_btn_id').on('click', function (e) {
      ws.send('exit');
   });
   $.getJSON('api', updateStatus);

});

function updateStatus(data) {
   // console.log(data);
   $('#type_status_field_id').text(data.type);
   $('#item_status_field_id').text(data.item);
   $('#value_status_field_id').text(data.value);
   $('#data_status_field_id').text(data.data);
   $('#updated_status_field_id').text(data.time);
}

function updateItemValue(data) {
   console.log(data);
   $('#item_5_current_value_field_id').text(data.value);
   $('#item_5_updated_field_id').text(data.time);
}