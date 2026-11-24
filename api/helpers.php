<?php

function responder(int $estado, $datos): void
{
    http_response_code($estado);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function datosGaleria(array $iniciales, ?array $nueva = null): array
{
    $ruta = __DIR__ . '/data/fotos_nuevas.json';
    $archivo = @fopen($ruta, $nueva === null ? 'rb' : 'r+b');

    if ($archivo === false) {
        throw new RuntimeException('No se pudo abrir el archivo de fotos.');
    }

    try {
        if (!flock($archivo, $nueva === null ? LOCK_SH : LOCK_EX)) {
            throw new RuntimeException('No se pudo bloquear el archivo.');
        }

        $texto = stream_get_contents($archivo);

        if ($texto === false || !str_starts_with(ltrim($texto), '[')) {
            throw new RuntimeException('Se esperaba una lista de fotos.');
        }

        $guardadas = json_decode($texto, true, 512, JSON_THROW_ON_ERROR);
        $todas = array_merge($iniciales, $guardadas);

        if ($nueva === null) {
            return $todas;
        }

        $id = max(array_column($todas, 'id')) + 1;
        $creada = ['id' => $id] + $nueva;
        $guardadas[] = $creada;

        $json = json_encode(
            $guardadas,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
        ) . "\n";

        if (!rewind($archivo) || @fwrite($archivo, $json) !== strlen($json)
            || !@ftruncate($archivo, strlen($json)) || !@fflush($archivo)) {
            throw new RuntimeException('No se pudo guardar la foto.');
        }

        return $creada;
    } finally {
        fclose($archivo);
    }
}