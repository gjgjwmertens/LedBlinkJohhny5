/**
 * Created by G on 23-10-2016.
 */

var ws = new WebSocket('ws://20.0.0.112:3030');
var currentValues = {
   'potentiometer': {data: 0, value: 0},
   'motorPower': {data: 0, value: 0},
   'motorFeedback': {data: 0, value: 0},
   'emf':  {data: 0, value: 0}
};

ws.onopen = function () {
   $('#websocket_conn_status_field_id').text('Connected');
   $('#websocket_conn_status_field_id').css('color', 'green');
   $('#websocket_status_led_id').css('background-color', 'greenyellow');
};

ws.onclose = function () {
   $('#websocket_conn_status_field_id').text('Disconnected');
   $('#websocket_conn_status_field_id').css('color', 'red');
   $('#websocket_status_led_id').css('background-color', 'red');
};

ws.onmessage = function (payload) {
   var data = '';
   try {
      data = JSON.parse(payload.data);
   } catch (e) {
      data = payload.data;
   }
   // console.log(typeof data);
   if (typeof data === 'object') {
      updateStatus(data);
      // updateGraph(data);
   } else {
      console.log('control.js::ws.onmessage: ' + data);
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

   $('#start_chopper_btn_id').on('click', function (e) {
      $.post('api', {
         command: 'start motor',
         value: 150
      }, updateCommandFeedback);
   });

   $('#set_chopper_btn_id').on('click', function (e) {
      $.post('api', {
         command: 'set motor',
         value: $('#set_chopper_value_input_field_id').val()
      }, updateCommandFeedback);
   });

   $('#stop_chopper_btn_id').on('click', function (e) {
      $.post('api', {
         command: 'stop motor',
         value: 150
      }, updateCommandFeedback);
   });

   $('#test_chopper_btn_id').on('click', function (e) {
      $.post('api', {
         command: 'test motor',
         value: 100
      }, updateCommandFeedback);
   });

   // $.getJSON('api', updateStatus);

});

function updateCommandFeedback(data) {
   console.log({location: 'control.js::updateCommandFeedback (data): ', msg: data});
   $('#command_feedback_field_id').text(data.msg);
}

function updateStatus(data) {
   switch (data.item) {
      case 'potentiometer':
         currentValues[data.item] = data;
         $('#pot_value_status_cell_id').text(data.value);
         $('#pot_data_status_cell_id').text(data.data);
         $('#pot_updated_status_cell_id').text(data.time);
         break;
      case 'motorPower':
         currentValues[data.item] = data;
         $('#mp_value_status_cell_id').text(data.value);
         $('#mp_data_status_cell_id').text(data.data);
         $('#mp_updated_status_cell_id').text(data.time);
         break;
      case 'motorFeedback':
         currentValues[data.item] = data;
         $('#mf_value_status_cell_id').text(data.value);
         $('#mf_data_status_cell_id').text(data.data);
         $('#mf_updated_status_cell_id').text(data.time);
         break;
   }
   var motorV = parseInt(currentValues['motorFeedback'].data),
      pwmV = parseInt(currentValues['motorPower'].data) - motorV;

   var emf = (motorV - (pwmV * 16)) / 4;
   console.log({location: 'control.js::updateStatus (emf): ',
      emf: emf,
      pwmV: pwmV,
      motorV: motorV
   });
   currentValues['emf'].data = emf;
}

function updateItemValue(data) {
   console.log('control.js::updateItemValue (data): ' + data);
   $('#item_5_current_value_field_id').text(data.value);
   $('#item_5_updated_field_id').text(data.time);
}