<?php


namespace App\Http\Controllers\Api\Product;

use App\ColourCode;
use App\Colours;
use App\Http\Controllers\Controller;
use App\Product;
use App\Size;
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
        $product = Product::findOne($code);

        $queryBuilder = Size::query();
        $queryBuilder->where('sizeCode', $product->sizes);
        $sizes = $queryBuilder->get();

        $queryBuilder = ColourCode::query();
        $queryBuilder->where('productCode', $product->code);
        $codes = $queryBuilder->get();

        $colours = array();
        $qoh = array();
        foreach ($codes as $code) {
            $queryBuilder = Colours::query();
            $queryBuilder->where('code', $code['codeKey']);
            $colour = $queryBuilder->get();
            $colours[] = $colour;

            $queryBuilder = Stock::query();
            $queryBuilder->where('style', $product['code']);
            $quantities = $queryBuilder->get();
            $qoh[] = $quantities;
        }

        $response = array(
            "code" => $product['code'],
            "description" => $product['descr'],
            "sizes" => $sizes,
            "qoh" => $qoh
        );

        return response()->json(['product' => $response], $this->successStatus);
    }
}
