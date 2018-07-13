THREE.DragControls = function(_camera, _objects, _domElement) {

    if (_objects instanceof THREE.Scene) {
        _objects = _objects.children;
    }

    var _raycaster = new THREE.Raycaster();
    var _mouse = new THREE.Vector3(),
        _offset = new THREE.Vector3();
    var _selected;


    _domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    _domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    _domElement.addEventListener('mouseup', onDocumentMouseUp, false);

    function onDocumentMouseMove(event) {
        event.preventDefault();

        _mouse.x = (event.clientX / _domElement.width) * 2 - 1;
        _mouse.y = -(event.clientY / _domElement.height) * 2 + 1;

        _raycaster.setFromCamera(_mouse, _camera);

        if (_selected) {
            var targetPos = _selected.object.position.multiplyScalar(_selected.distance).add(_camera.position);
            _selected.object.position.copy(targetPos.sub(_offset));
            return;

        }

        var intersects = _raycaster.intersectObjects(_objects);

        if (intersects.length > 0) {

            _domElement.style.cursor = 'pointer';

        } else {

            _domElement.style.cursor = 'auto';

        }

    }

    function onDocumentMouseDown(event) {

        event.preventDefault();

        _mouse.x = (event.clientX / _domElement.width) * 2 - 1;
        _mouse.y = -(event.clientY / _domElement.height) * 2 + 1;

        _raycaster.setFromCamera(_mouse, _camera);
        var intersects = _raycaster.intersectObjects(_objects);


        if (intersects.length > 0) {
            _selected = intersects[0];
            _offset.copy(_selected.point).sub(_selected.object.position);
            _domElement.style.cursor = 'move';
        }


    }

    function onDocumentMouseUp(event) {

        event.preventDefault();

        if (_selected) {
            _selected = null;
        }

        _domElement.style.cursor = 'auto';

    }


}
