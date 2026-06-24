<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Post;

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Kredensial tidak sesuai.'],
        ]);
    }

    return response()->json([
        'token' => $user->createToken('admin-token')->plainTextToken,
        'user' => $user
    ]);
});

// Public Blog API
Route::get('/posts', function () {
    return response()->json(Post::latest()->get());
});
Route::get('/posts/{slug}', function ($slug) {
    return response()->json(Post::where('slug', $slug)->firstOrFail());
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // Admin Posts API
    Route::post('/posts', function (Request $request) {
        $validated = $request->validate([
            'judul' => 'required|string',
            'slug' => 'required|string|unique:posts,slug',
            'konten' => 'required|string',
            'status' => 'required|string',
            'thumbnail' => 'nullable|string'
        ]);
        return response()->json(Post::create($validated));
    });

    Route::put('/posts/{id}', function (Request $request, $id) {
        $post = Post::findOrFail($id);
        $post->update($request->all());
        return response()->json($post);
    });

    Route::delete('/posts/{id}', function ($id) {
        Post::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    });
});
