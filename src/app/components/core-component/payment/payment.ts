import { Component } from '@angular/core';
import { PaymentService } from '../../../service/payment';
declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class Payment {
  constructor(private paymentService: PaymentService) { }

  payNow() {
    debugger;
    this.paymentService.createOrder(500).subscribe(order => {
      const options = {
        key: "rzp_test_SL8lBAFMnydVDl", // your test key
        amount: order.amount,
        currency: "INR",
        name: "Hotel Booking",
        description: "Room Booking Payment",
        order_id: order.id,
        handler: (response: any) => {

          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          };

          this.paymentService.verifyPayment(paymentData)
            .subscribe(res => {
              alert("Payment Successful & Verified ✅");
            });

        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    });
  }
}
