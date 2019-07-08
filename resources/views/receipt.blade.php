<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>
    <meta charset="utf-8"/>
    <title>Fashion World Receipt</title>
    <meta name="author" content="Fashion World"/>
    <meta name="subject" content="Receipt"/>
    <meta name="date" content="{{ 'now'|date('Y-m-d') }}"/>
</head>
<body>
<header>
    <header>
        <h4>Fashion World</h4>
    </header>
    <section>
        <span>Tax {{ $type }}</span>
        <span>{{ $method }}</span>
    </section>
    <footer>
        <article>
            <address>
                <p>Shop {{ $branch }}</p>
                <p>Nelspruit Plaza</p>
                <p>Tel: 2800000</p>
            </address>
            <p>Vat Reg Number: 215165111</p>
        </article>
    </footer>
</header>
<main>
    <header>
        <span>{{ $transaction_id }}</span>
        <span>{{ $date }}</span>
        <span>{{ $time }}</span>
        <span>{{ $branch }}</span>
        <span style="float: right;">Till No: {{ $till }}</span>
    </header>
    <section>
        <table>
            <thead>
                <tr>
                    <th>Style</th>
                    <th>Desc</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
            @foreach ($transactions as $transaction)
                <tr>
                    <td>{{ $transaction['code'] }} {{ $transaction['size'] }} {{ $transaction['colour'] }}</td>
                    <td>{{ $transaction['description'] }}</td>
                    <td>{{ $transaction['qty'] }}</td>
                    <td>{{ $transaction['price'] }}</td>
                    <td>{{ $transaction['total'] }}</td>
                </tr>
            @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4">Total Quantity: </td>
                    <td colspan="4">{{ $totals['qty'] }}</td>
                </tr>
                <tr>
                    <td colspan="4">Total VAT (15.00%): </td>
                    <td colspan="4">{{ $totals['vat'] }}</td>
                </tr>
                <tr>
                    <td colspan="4">Total Value: </td>
                    <td colspan="4">{{ $totals['total'] }}</td>
                </tr>
            </tfoot>
        </table>
    </section>
    <footer>
        <section style="display: flex">
            <span>Amount Due: </span>
            <span>{{ $totals['total'] }}</span>
        </section>
        <section style="display: flex">
            <span>Payment Method: {{ $method }}</span>
            <span>{{ $tendered }}</span>
        </section>
        <hr/>
        <section style="display: flex">
            <span>Change: </span>
            <span>{{ $change }}</span>
        </section>
    </footer>
</main>
<footer>
    <h5 style="text-transform: uppercase">
        Refunds and exchanges accepted as per refund and exchange policy in store. Terms and conditions apply. No exchange
        on underwear, leggings and bodysuits
    </h5>
</footer>
</body>
</html>
