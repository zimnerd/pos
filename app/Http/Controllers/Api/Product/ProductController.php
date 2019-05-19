<?php


namespace App\Http\Controllers\Api\Product;

use App\ColourCode;
use App\Colours;
use App\Http\Controllers\Controller;
use App\Product;
use App\Size;
use App\Stock;
use PhpParser\Builder;

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
        $products = Product::all();

        $stock = array();
        foreach ($products as $product) {
            /**
             * @var Builder $queryBuilder
             */
            $queryBuilder = Size::query();
            $queryBuilder->where('sizeCode', $product['sizes']);
            $sizes = $queryBuilder->get();

            $queryBuilder = ColourCode::query();
            $queryBuilder->where('productCode', $product['code']);
            $code = $queryBuilder->get();

            $queryBuilder = Colours::query();
            $queryBuilder->where('code', $code['codeKey']);
            $colours = $queryBuilder->get();

            $queryBuilder = Stock::query();
            $queryBuilder->where('style', $product['code']);
            $quantities = $queryBuilder->get();

            $stock[] = array(
                "code" => $product['code'],
                "description" => $product['description'],
                "sizes" => $sizes,
                "colours" => $colours,
                "quantities" => $quantities
            );
        }

        return response()->json(['products' => $stock], $this->successStatus);
    }

}
