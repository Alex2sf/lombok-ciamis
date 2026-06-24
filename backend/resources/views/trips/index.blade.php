<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-2xl text-gray-800 leading-tight">
                {{ __('Kelola Paket Trip') }}
            </h2>
            <a href="{{ route('trips.create') }}" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-md shadow-blue-200 flex items-center">
                <svg class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Tambah Trip
            </a>
        </div>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th scope="col" class="px-6 py-4">Nama Paket</th>
                                <th scope="col" class="px-6 py-4">Destinasi</th>
                                <th scope="col" class="px-6 py-4">Keberangkatan</th>
                                <th scope="col" class="px-6 py-4">Status</th>
                                <th scope="col" class="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($trips as $trip)
                            <tr class="bg-white border-b border-gray-50 hover:bg-gray-50 transition">
                                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ $trip->nama }}
                                </td>
                                <td class="px-6 py-4">{{ $trip->destinasi }}</td>
                                <td class="px-6 py-4">
                                    {{ $trip->tanggal_berangkat ? \Carbon\Carbon::parse($trip->tanggal_berangkat)->format('d M Y') : 'Setiap Hari' }}
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-3 py-1 rounded-full text-xs font-medium 
                                        {{ $trip->status == 'Aktif' ? 'bg-green-100 text-green-700' : ($trip->status == 'Penuh' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700') }}">
                                        {{ $trip->status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right space-x-2">
                                    <a href="{{ route('trips.edit', $trip->id) }}" class="font-medium text-blue-600 hover:text-blue-800">Edit</a>
                                    <form action="{{ route('trips.destroy', $trip->id) }}" method="POST" class="inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="font-medium text-red-600 hover:text-red-800 ml-2" onclick="return confirm('Yakin hapus trip ini?')">Hapus</button>
                                    </form>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="5" class="px-6 py-8 text-center text-gray-400">
                                    <svg class="mx-auto h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                    Belum ada paket trip. Klik tombol <b>Tambah Trip</b> untuk membuat baru.
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                
                <div class="px-6 py-4 border-t border-gray-100">
                    {{ $trips->links() }}
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
