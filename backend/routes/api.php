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

// Public Destinations API (with auto-seeding)
Route::get('/destinations', function () {
    $destinations = \App\Models\Destination::all();
    if ($destinations->isEmpty()) {
        $defaultLombok = [
            'key' => 'lombok',
            'label' => 'Lombok',
            'region' => 'Nusa Tenggara Barat',
            'hero_tagline' => 'Mulai dari nyantai di pantai pasir pink, trekking santai, sampai keliling pulau kecil pakai kapal. Kita sudah atur semua rutenya biar kamu tinggal menikmati perjalanan aja.',
            'accent_color' => 'bg-blue-600',
            'accent_text_color' => 'text-blue-600',
            'wa_message' => 'Halo! Mau nanya dong buat jadwal Open Trip ke Lombok yang paling deket kapan ya?',
            'spots' => [
                [
                    'name' => 'Pantai Pink & Gili Hopping',
                    'desc' => 'Pantai unik dengan pasir warna pink alami. Kita bakal sewa kapal buat mampir ke pulau-pulau kecil di sekitarnya dan berenang sepuasnya.',
                    'img' => 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900&q=85',
                    'tag' => 'Paling Ramai',
                    'color' => 'from-pink-500/80 to-rose-700/80',
                ],
                [
                    'name' => 'Trekking Rinjani',
                    'desc' => 'Naik ke gunung ikonik Lombok. Tenang aja, porter kita yang bakal bawain tenda dan alat masak. Kamu tinggal jalan santai sambil nikmati pemandangan danau.',
                    'img' => 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=85',
                    'tag' => 'Rekomendasi Petualang',
                    'color' => 'from-slate-700/80 to-slate-900/80',
                ],
                [
                    'name' => 'Senggigi & Kapal Sunset',
                    'desc' => 'Sore-sore kita naik perahu keliling area pantai Senggigi buat nungguin sunset pas matahari tenggelam di balik Gunung Agung Bali.',
                    'img' => 'https://images.unsplash.com/photo-1586053226626-d6215f91d9d9?w=900&q=85',
                    'tag' => 'Nyantai Sore',
                    'color' => 'from-orange-500/80 to-amber-700/80',
                ],
                [
                    'name' => 'Snorkeling Gili Trawangan',
                    'desc' => 'Berenang bareng penyu liar di laut lepas Gili Trawangan. Spot terumbu karangnya bagus dan airnya jernih banget.',
                    'img' => 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=85',
                    'tag' => 'Wajib Coba',
                    'color' => 'from-cyan-500/80 to-blue-700/80',
                ]
            ],
            'itinerary' => [
                [
                    'day' => 'Hari 1',
                    'title' => 'Dijemput & Keliling Gili Trawangan',
                    'desc' => 'Tim kita jemput kamu langsung di bandara. Langsung check-in hotel, ganti baju, terus nyebrang naik kapal buat keliling 3 pulau Gili sekalian snorkeling bareng guide lokal.',
                    'icon' => '🚤',
                ],
                [
                    'day' => 'Hari 2',
                    'title' => 'Sunrise Bukit Merese & Pantai Pink',
                    'desc' => 'Bangun subuh dikit buat berburu foto sunrise di atas Bukit Merese. Siangnya kita meluncur ke Pantai Pink buat santai-santai dan makan siang ikan bakar.',
                    'icon' => '🏖️',
                ],
                [
                    'day' => 'Hari 3',
                    'title' => 'Jalan-Jalan Senggigi & Sunset Cruise',
                    'desc' => 'Nyari oleh-oleh lokal di pasar seni, lanjut makan kuliner khas ayam taliwang, terus sorenya sewa boat santai menikmati pemandangan sunset.',
                    'icon' => '🌅',
                ],
                [
                    'day' => 'Hari 4',
                    'title' => 'Desa Adat Sasak & Pulang',
                    'desc' => 'Sebelum balik ke bandara, kita mampir dulu ke Desa Adat Sasak buat ngelihat rumah tradisional dan cara bikin kain tenun lokal. Habis itu langsung diantar ke bandara.',
                    'icon' => '🏡',
                ]
            ],
            'packages' => [
                [
                    'name' => 'Paket Backpacker (3D2N)',
                    'price' => 1500000,
                    'description' => 'Liburan seru bareng temen-temen dengan budget super ramah di kantong.',
                    'image' => 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
                    'features' => [
                        'Homestay AC Share Room',
                        'Transportasi AC Selama Trip',
                        'Makan 6x Sesuai Program',
                        'Snorkeling Equipment',
                        'Dokumentasi Foto & Gopro'
                    ]
                ],
                [
                    'name' => 'Paket Premium Couple (3D2N)',
                    'price' => 3500000,
                    'description' => 'Spesial buat lu dan pasangan yang mau menikmati keindahan Lombok secara privat.',
                    'image' => 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80',
                    'features' => [
                        'Hotel Bintang 3 Private Room',
                        'Mobil Privat + Driver & Bensin',
                        'Makan Romantis Malam Hari',
                        'Tiket Masuk Semua Spot Wisata',
                        'Dokumentasi Premium & Drone'
                    ]
                ],
                [
                    'name' => 'Paket Adventurer Rinjani (4D3N)',
                    'price' => null,
                    'description' => 'Pendakian gunung Rinjani lengkap dengan porter dan perlengkapan camping kelas premium.',
                    'image' => 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
                    'features' => [
                        'Tenda Dome Premium Kapasitas 4',
                        'Porter Pembawa Alat & Makanan',
                        'Makan Selama Pendakian',
                        'Peralatan Masak & Makan Lengkap',
                        'Simaksi / Tiket Masuk Rinjani'
                    ]
                ]
            ]
        ];

        $defaultCiamis = [
            'key' => 'ciamis',
            'label' => 'Ciamis',
            'region' => 'Jawa Barat',
            'hero_tagline' => 'Dari serunya susur sungai arus Green Canyon sampai nyantai menikmati angin sore di Pantai Pangandaran. Trip pas buat kamu yang mau liburan singkat akhir pekan.',
            'accent_color' => 'bg-emerald-600',
            'accent_text_color' => 'text-emerald-600',
            'wa_message' => 'Halo! Boleh minta info detail dan harga paket Open Trip ke Ciamis-Pangandaran?',
            'spots' => [
                [
                    'name' => 'Pantai Pangandaran',
                    'desc' => 'Nggak usah bingung mau lihat sunrise atau sunset, di pantai barat dan timur Pangandaran kamu bisa nikmati keduanya sekaligus. Kuliner seafood-nya juga murah meriah.',
                    'img' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85',
                    'tag' => 'Destinasi Utama',
                    'color' => 'from-cyan-500/80 to-teal-700/80',
                ],
                [
                    'name' => 'Hutan Cagar Alam Pananjung',
                    'desc' => 'Jalan santai di bawah rindangnya pepohonan sambil lihat kawanan rusa dan monyet ekor panjang yang ramah berkeliaran bebas.',
                    'img' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=85',
                    'tag' => 'Nuansa Alam',
                    'color' => 'from-green-600/80 to-emerald-900/80',
                ],
                [
                    'name' => 'Body Rafting Green Canyon',
                    'desc' => 'Berenang hanyut menyusuri aliran sungai berair hijau toska diapit tebing batu tinggi. Kegiatan paling seru dan menantang di trip ini.',
                    'img' => 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=900&q=85',
                    'tag' => 'Paling Seru',
                    'color' => 'from-emerald-500/80 to-green-800/80',
                ],
                [
                    'name' => 'Situ Lengkong Panjalu',
                    'desc' => 'Danau tenang bernuansa sejuk dengan pulau kecil di tengahnya. Kita bakal naik perahu keliling danau sekalian mampir ziarah budaya sejarah lokal.',
                    'img' => 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=85',
                    'tag' => 'Wisata Santai',
                    'color' => 'from-indigo-500/80 to-purple-800/80',
                ]
            ],
            'itinerary' => [
                [
                    'day' => 'Hari 1',
                    'title' => 'Jalan ke Pangandaran & Sunset Pantai',
                    'desc' => 'Kumpul pagi di meeting point, lalu berangkat bareng pakai Elf/Hiace ber-AC. Siang sampai Pangandaran langsung check-in homestay, makan siang, terus sorenya nyantai nonton sunset.',
                    'icon' => '🌊',
                ],
                [
                    'day' => 'Hari 2',
                    'title' => 'Body Rafting di Green Canyon',
                    'desc' => 'Habis sarapan, kita langsung meluncur ke lokasi rafting. Pasang pelampung, terus rasakan serunya hanyut menyusuri sungai Green Canyon yang sejuk bareng instruktur berpengalaman.',
                    'icon' => '🏞️',
                ],
                [
                    'day' => 'Hari 3',
                    'title' => 'Explore Cagar Alam & Situ Lengkong',
                    'desc' => 'Pagi-pagi jalan santai di hutan cagar alam ketemu rusa jinak. Siangnya kita geser ke Situ Lengkong buat naik perahu santai sebelum perjalanan pulang ke kota asal.',
                    'icon' => '🌿',
                ],
                [
                    'day' => 'Hari 4',
                    'title' => 'Beli Oleh-Oleh & Antar Pulang',
                    'desc' => 'Belanja camilan khas Galendo dan kerajinan lokal buat dibawa pulang. Kita makan siang bareng menu nasi liwet khas Sunda sebelum diantar balik ke meeting point awal.',
                    'icon' => '🛖',
                ]
            ],
            'packages' => [
                [
                    'name' => 'Paket Hemat Body Rafting (2D1N)',
                    'price' => 750000,
                    'description' => 'Trip singkat akhir pekan buat ngerasain serunya body rafting di Green Canyon.',
                    'image' => 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=600&q=80',
                    'features' => [
                        'Penginapan Homestay AC',
                        'Tiket Body Rafting Green Canyon',
                        'Makan 4x Prasmanan',
                        'Transportasi Elf/Hiace AC PP',
                        'Instruktur Rafting Berpengalaman'
                    ]
                ],
                [
                    'name' => 'Paket Family Gathering (3D2N)',
                    'price' => 1250000,
                    'description' => 'Cocok untuk liburan keluarga besar atau rombongan kantor dengan fasilitas lengkap.',
                    'image' => 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80',
                    'features' => [
                        'Hotel Dekat Pantai Private Room',
                        'Transportasi Bus Pariwisata AC',
                        'Makan 8x Prasmanan + Seafood',
                        'Tiket Masuk Semua Spot Wisata',
                        'Dokumentasi Foto & Video Udara'
                    ]
                ],
                [
                    'name' => 'Paket Custom Trip Ciamis',
                    'price' => null,
                    'description' => 'Punya rencana trip sendiri atau spot custom yang mau dikunjungi? Hubungi admin kita.',
                    'image' => 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
                    'features' => [
                        'Jadwal Fleksibel Sesuai Request',
                        'Pilihan Kendaraan Elf/Hiace/Bus',
                        'Pilihan Penginapan Variatif',
                        'Bebas Pilih Spot Destinasi',
                        'Konsultasi Rute Gratis dengan Admin'
                    ]
                ]
            ]
        ];
        \App\Models\Destination::create($defaultLombok);
        \App\Models\Destination::create($defaultCiamis);
        $destinations = \App\Models\Destination::all();
    }
    return response()->json($destinations);
});

// Public Blog API
Route::get('/posts', function () {
    return response()->json(Post::latest()->get());
});
Route::get('/posts/{slug}', function ($slug) {
    return response()->json(Post::where('slug', $slug)->firstOrFail());
});

// Public Services API
Route::get('/services', function () {
    $filePath = storage_path('app/services.json');
    if (file_exists($filePath)) {
        $content = json_decode(file_get_contents($filePath), true);
        return response()->json($content);
    }
    return response()->json([]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/services', function (Request $request) {
        $data = $request->input('services', []);
        $dir = storage_path('app');
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        file_put_contents(storage_path('app/services.json'), json_encode($data, JSON_PRETTY_PRINT));
        return response()->json(['message' => 'Services updated successfully', 'data' => $data]);
    });
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::post('/upload', function (Request $request) {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('uploads', $filename, 'public');
            $url = asset('storage/' . $path);
            return response()->json([
                'url' => $url,
                'path' => $path
            ]);
        }

        return response()->json(['error' => 'File tidak ditemukan.'], 400);
    });

    // Admin Destinations API
    Route::put('/destinations/{key}', function (Request $request, $key) {
        $destination = \App\Models\Destination::findOrFail($key);
        $destination->update($request->only([
            'label',
            'region',
            'hero_tagline',
            'wa_message',
            'spots',
            'itinerary',
            'packages'
        ]));
        return response()->json($destination);
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
