<?php


namespace App\Http\Controllers\Api\Product;

use App\ColourCode;
use App\Colours;
use App\Http\Controllers\Controller;
use App\Prices;
use App\Product;
use App\Stock;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public $successStatus = 200;

    /**
     * Retrieve the products in the application
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function retrieveStock(Request $request)
    {
        $search = $request->input('search');
        $limit = $request->input('limit');
        if (!$limit) {
            $limit = 25;
        }

        if (!$search) {
            $products = Product::paginate($limit);
        } else {
            $products = Product::query()
                ->where('descr', 'LIKE', "%{$search}%")
                ->orWhere('code', 'LIKE', "%{$search}%")
                ->paginate($limit);
        }

        return response()->json(['products' => $products], $this->successStatus);
    }


    /**
     * Retrieve a product
     *
     * @param string $code
     * @return \Illuminate\Http\Response
     */
    public function retrieveProduct($code)
    {
        /**
         * @var Product $product
         */
        $product = Product::find($code);

        $queryBuilder = ColourCode::query();
        $queryBuilder->where('productCode', $product->code);
        $codes = $queryBuilder->get();

        $colours = array();
        foreach ($codes as $code) {
            $queryBuilder = Colours::query();
            $queryBuilder->where('code', $code->codeKey);
            $colour = $queryBuilder->get();
            if ($colour) {
                $colours[] = $colour[0];
            }
        }

        $queryBuilder = Prices::query();
        $queryBuilder->where('style', $product->code);
        $prices = $queryBuilder->get();

        $queryBuilder = Stock::query();
        $queryBuilder->where('style', $product->code);
        $quantities = $queryBuilder->get();

        $response = array(
            "code" => $product->code,
            "description" => $product->descr,
            "colours" => $colours,
            "prices" => $prices,
            "info" => $quantities
        );

        return response()->json(['product' => $response], $this->successStatus);
    }
}
