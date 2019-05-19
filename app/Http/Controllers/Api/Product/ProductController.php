<?php


namespace App\Http\Controllers\Api\Product;

use App\ColourCode;
use App\Colours;
use App\Http\Controllers\Controller;
use App\Product;
use App\Size;
use App\Stock;

class ProductController extends Controller
{
    public $successStatus = 200;

    /**
     * Retrieve the products in the application
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveStock()
    {
        $products = Product::paginate(30);

        $stock = array();
        foreach ($products as $product) {
//            $queryBuilder = Size::query();
//            $queryBuilder->where('sizeCode', $product['sizes']);
//            $queryBuilder->where('sizeCode', $product['sizes']);
//            $sizes = $queryBuilder->get();
//
//            $queryBuilder = ColourCode::query();
//            $queryBuilder->where('productCode', $product['code']);
//            $codes = $queryBuilder->get();
//
//            $colours = array();
//            foreach ($codes as $code) {
//                $queryBuilder = Colours::query();
//                $queryBuilder->where('code', $code['codeKey']);
//                $colour = $queryBuilder->get();
//
//                if (isset($colour['colour'])) {
//                    $colours[] = $colour['colour'];
//                }
//            }
//
//            $queryBuilder = Stock::query();
//            $queryBuilder->where('style', $product['code']);
//            $quantities = $queryBuilder->get();

            $stock[] = array(
                "code" => $product['code'],
                "description" => $product['descr']
            );
        }

        return response()->json(['products' => $stock], $this->successStatus);
    }

}
